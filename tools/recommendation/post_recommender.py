#!/usr/bin/env python3
"""
UnitEd recommendation module for post ranking experiments.

This module is intentionally kept outside the frontend/runtime codebase.
It demonstrates a content-based ranking workflow for UnitEd posts without
changing any existing application functionality.

Example:
    python tools/recommendation/post_recommender.py --demo
    python tools/recommendation/post_recommender.py ^
        --profile-file tools/recommendation/sample_profile.json ^
        --posts-file tools/recommendation/sample_posts.json ^
        --top-k 5
    python tools/recommendation/post_recommender.py --demo ^
        --output-json tools/recommendation/output/demo_report.json
"""

from __future__ import annotations

import argparse
import getpass
import json
import math
import os
import re
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict, Iterable, List, Sequence
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


MODULE_NAME = "UnitEd Recommendation Module"
MODULE_VERSION = "1.0.0"
MODEL_NAME = "Cosine Similarity Ranker"
PIPELINE_NAME = "post-discovery-ranking"
DEFAULT_TOP_K = 5
DEFAULT_SERVER_HOST = "127.0.0.1"
DEFAULT_SERVER_PORT = 8765
MAX_LOG_LINES = 200
REQUEST_LOGS: List[str] = []


@dataclass(frozen=True)
class StudentProfile:
    student_id: str
    name: str
    department: str
    skills: List[str]
    interests: List[str]
    year_of_graduation: int | None = None


@dataclass(frozen=True)
class Post:
    post_id: str
    title: str
    purpose: str
    department: str
    required_skills: List[str]
    preferred_skills: List[str]
    description_keywords: List[str]
    status: str = "active"


@dataclass(frozen=True)
class Recommendation:
    post_id: str
    title: str
    cosine_score: float
    matched_terms: List[str]
    rationale: str


@dataclass(frozen=True)
class RecommendationReport:
    module: str
    version: str
    generated_at: str
    pipeline: str
    model: str
    profile: Dict[str, Any]
    summary: Dict[str, Any]
    recommendations: List[Dict[str, Any]]


@dataclass(frozen=True)
class SupabaseConfig:
    url: str
    anon_key: str


def _normalize_token(token: str) -> str:
    return token.strip().lower().replace("&", "and")


def _split_text_terms(value: str) -> List[str]:
    return [match.group(0) for match in re.finditer(r"[a-z0-9+#.-]+", value.lower())]


def _clean_terms(values: Iterable[str]) -> List[str]:
    unique_terms = []
    seen = set()
    for value in values:
        token = _normalize_token(value)
        if not token or token in seen:
            continue
        seen.add(token)
        unique_terms.append(token)
    return unique_terms


def _weighted_terms_for_profile(profile: StudentProfile) -> Dict[str, float]:
    weights: Dict[str, float] = {}
    for skill in _clean_terms(profile.skills):
        weights[skill] = weights.get(skill, 0.0) + 3.0
    for interest in _clean_terms(profile.interests):
        weights[interest] = weights.get(interest, 0.0) + 1.5
    department = _normalize_token(profile.department)
    if department:
        weights[department] = weights.get(department, 0.0) + 1.0
    return weights


def _weighted_terms_for_post(post: Post) -> Dict[str, float]:
    weights: Dict[str, float] = {}
    for skill in _clean_terms(post.required_skills):
        weights[skill] = weights.get(skill, 0.0) + 3.0
    for skill in _clean_terms(post.preferred_skills):
        weights[skill] = weights.get(skill, 0.0) + 1.5
    for keyword in _clean_terms(post.description_keywords):
        weights[keyword] = weights.get(keyword, 0.0) + 1.0
    department = _normalize_token(post.department)
    purpose = _normalize_token(post.purpose)
    if department:
        weights[department] = weights.get(department, 0.0) + 0.75
    if purpose:
        weights[purpose] = weights.get(purpose, 0.0) + 0.5
    return weights


def _build_vocabulary(profile: StudentProfile, posts: Sequence[Post]) -> List[str]:
    vocab = set(_weighted_terms_for_profile(profile).keys())
    for post in posts:
        vocab.update(_weighted_terms_for_post(post).keys())
    return sorted(vocab)


def _vectorize(weights: Dict[str, float], vocabulary: Sequence[str]) -> List[float]:
    return [weights.get(token, 0.0) for token in vocabulary]


def _cosine_similarity(left: Sequence[float], right: Sequence[float]) -> float:
    numerator = sum(a * b for a, b in zip(left, right))
    left_norm = math.sqrt(sum(value * value for value in left))
    right_norm = math.sqrt(sum(value * value for value in right))
    if left_norm == 0.0 or right_norm == 0.0:
        return 0.0
    return numerator / (left_norm * right_norm)


def _matched_terms(
    profile_weights: Dict[str, float],
    post_weights: Dict[str, float],
    limit: int = 5,
) -> List[str]:
    overlapping = []
    for token in sorted(set(profile_weights).intersection(post_weights)):
        overlapping.append((token, profile_weights[token] + post_weights[token]))
    overlapping.sort(key=lambda item: (-item[1], item[0]))
    return [token for token, _score in overlapping[:limit]]


def recommend_posts(
    profile: StudentProfile,
    posts: Sequence[Post],
    top_k: int = 5,
) -> List[Recommendation]:
    active_posts = [post for post in posts if post.status.lower() == "active"]
    if not active_posts:
        return []

    profile_weights = _weighted_terms_for_profile(profile)
    vocabulary = _build_vocabulary(profile, active_posts)
    profile_vector = _vectorize(profile_weights, vocabulary)

    recommendations: List[Recommendation] = []
    for post in active_posts:
        post_weights = _weighted_terms_for_post(post)
        post_vector = _vectorize(post_weights, vocabulary)
        cosine_score = _cosine_similarity(profile_vector, post_vector)
        terms = _matched_terms(profile_weights, post_weights)
        rationale = (
            f"Matched on {', '.join(terms)}"
            if terms
            else "Low explicit overlap, ranked by sparse content similarity"
        )
        recommendations.append(
            Recommendation(
                post_id=post.post_id,
                title=post.title,
                cosine_score=round(cosine_score, 4),
                matched_terms=terms,
                rationale=rationale,
            )
        )

    recommendations.sort(key=lambda item: item.cosine_score, reverse=True)
    return recommendations[:top_k]


def build_report(
    profile: StudentProfile,
    posts: Sequence[Post],
    recommendations: Sequence[Recommendation],
    top_k: int,
) -> RecommendationReport:
    active_posts = [post for post in posts if post.status.lower() == "active"]
    vocabulary_size = len(_build_vocabulary(profile, active_posts)) if active_posts else 0
    return RecommendationReport(
        module=MODULE_NAME,
        version=MODULE_VERSION,
        generated_at=datetime.now(timezone.utc).isoformat(),
        pipeline=PIPELINE_NAME,
        model=MODEL_NAME,
        profile={
            "student_id": profile.student_id,
            "name": profile.name,
            "department": profile.department,
            "year_of_graduation": profile.year_of_graduation,
            "skills_count": len(_clean_terms(profile.skills)),
            "interests_count": len(_clean_terms(profile.interests)),
        },
        summary={
            "requested_top_k": top_k,
            "active_posts_considered": len(active_posts),
            "recommendations_returned": len(recommendations),
            "vocabulary_size": vocabulary_size,
        },
        recommendations=[asdict(item) for item in recommendations],
    )


def _load_profile(path: Path) -> StudentProfile:
    payload = json.loads(path.read_text(encoding="utf-8"))
    return StudentProfile(**payload)


def _load_posts(path: Path) -> List[Post]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    return [Post(**item) for item in payload]


def _demo_profile() -> StudentProfile:
    return StudentProfile(
        student_id="stu-001",
        name="Ananya",
        department="CSE",
        skills=["Python", "Machine Learning", "Data Analysis", "NLP", "Git"],
        interests=["research", "ai", "computer vision"],
        year_of_graduation=2027,
    )


def _demo_posts() -> List[Post]:
    return [
        Post(
            post_id="post-101",
            title="AI Research Assistant for Vision Models",
            purpose="research",
            department="CSE",
            required_skills=["Python", "Machine Learning", "Computer Vision"],
            preferred_skills=["PyTorch", "Git"],
            description_keywords=["ai", "research", "vision", "experimentation"],
        ),
        Post(
            post_id="post-102",
            title="Web Platform Engineer for Faculty Dashboard",
            purpose="project",
            department="IT",
            required_skills=["React", "TypeScript", "SQL"],
            preferred_skills=["UI Design", "Testing"],
            description_keywords=["dashboard", "frontend", "platform"],
        ),
        Post(
            post_id="post-103",
            title="NLP Internship for Academic Document Mining",
            purpose="research",
            department="CSE",
            required_skills=["Python", "NLP", "Data Analysis"],
            preferred_skills=["Transformers", "Machine Learning"],
            description_keywords=["language", "papers", "research", "analytics"],
        ),
        Post(
            post_id="post-104",
            title="Embedded Systems Research Trainee",
            purpose="research",
            department="ECE",
            required_skills=["C", "Microcontrollers", "Signal Processing"],
            preferred_skills=["MATLAB"],
            description_keywords=["hardware", "circuits", "embedded"],
        ),
    ]


def _extract_description_keywords(text: str, limit: int = 12) -> List[str]:
    keywords = []
    seen = set()
    for token in _split_text_terms(text):
        if len(token) < 3 or token in seen:
            continue
        seen.add(token)
        keywords.append(token)
        if len(keywords) >= limit:
            break
    return keywords


def _extract_post_skills(skill_requirements: Any) -> List[str]:
    extracted: List[str] = []
    if isinstance(skill_requirements, list):
        for item in skill_requirements:
            if isinstance(item, dict):
                if isinstance(item.get("skill"), str):
                    extracted.append(item["skill"])
                if isinstance(item.get("skills"), list):
                    extracted.extend(skill for skill in item["skills"] if isinstance(skill, str))
            elif isinstance(item, str):
                extracted.append(item)
    return _clean_terms(extracted)


def _load_repo_supabase_config() -> SupabaseConfig:
    client_path = Path(__file__).resolve().parents[2] / "src" / "integrations" / "supabase" / "client.ts"
    client_source = client_path.read_text(encoding="utf-8")
    url_match = re.search(r'const SUPABASE_URL = "([^"]+)"', client_source)
    key_match = re.search(r'const SUPABASE_PUBLISHABLE_KEY = "([^"]+)"', client_source)
    if not url_match or not key_match:
        raise RuntimeError(f"Unable to read Supabase config from {client_path}")
    return SupabaseConfig(url=url_match.group(1), anon_key=key_match.group(1))


def _resolve_supabase_config() -> SupabaseConfig:
    url = os.getenv("SUPABASE_URL")
    anon_key = os.getenv("SUPABASE_ANON_KEY")
    if url and anon_key:
        return SupabaseConfig(url=url, anon_key=anon_key)
    return _load_repo_supabase_config()


def _http_json(
    url: str,
    *,
    method: str = "GET",
    headers: Dict[str, str] | None = None,
    payload: Dict[str, Any] | None = None,
) -> Any:
    request_headers = {"Accept": "application/json", **(headers or {})}
    body = None
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        request_headers["Content-Type"] = "application/json"

    request = Request(url, data=body, headers=request_headers, method=method)
    try:
        with urlopen(request, timeout=20) as response:
            content = response.read().decode("utf-8")
    except HTTPError as exc:
        details = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Supabase request failed ({exc.code}): {details}") from exc
    except URLError as exc:
        raise RuntimeError(f"Supabase request failed: {exc.reason}") from exc

    if not content.strip():
        return None
    return json.loads(content)


def _supabase_headers(api_key: str, bearer_token: str | None = None) -> Dict[str, str]:
    token = bearer_token or api_key
    return {
        "apikey": api_key,
        "Authorization": f"Bearer {token}",
    }


def _authenticate_supabase(config: SupabaseConfig, email: str, password: str) -> Dict[str, Any]:
    auth_url = f"{config.url}/auth/v1/token?grant_type=password"
    return _http_json(
        auth_url,
        method="POST",
        headers=_supabase_headers(config.anon_key),
        payload={"email": email, "password": password},
    )


def _load_profile_from_supabase(config: SupabaseConfig, email: str, password: str) -> StudentProfile:
    auth_payload = _authenticate_supabase(config, email, password)
    access_token = auth_payload.get("access_token")
    user_payload = auth_payload.get("user") or {}
    user_id = user_payload.get("id")
    if not access_token or not user_id:
        raise RuntimeError("Supabase authentication succeeded but no access token/user id was returned.")

    query = urlencode(
        {
            "select": "id,first_name,last_name,department,skills,specialization,year_of_graduation",
            "id": f"eq.{user_id}",
        }
    )
    profile_url = f"{config.url}/rest/v1/profiles?{query}"
    profile_rows = _http_json(
        profile_url,
        headers=_supabase_headers(config.anon_key, access_token),
    )
    if not profile_rows:
        raise RuntimeError("No profile row was returned for the authenticated Supabase user.")

    row = profile_rows[0]
    name_parts = [row.get("first_name") or "", row.get("last_name") or ""]
    profile_name = " ".join(part for part in name_parts if part).strip() or email
    interests = row.get("specialization") or []
    if not isinstance(interests, list):
        interests = []

    return StudentProfile(
        student_id=row.get("id", user_id),
        name=profile_name,
        department=row.get("department") or "Unknown",
        skills=[skill for skill in (row.get("skills") or []) if isinstance(skill, str)],
        interests=[item for item in interests if isinstance(item, str)],
        year_of_graduation=row.get("year_of_graduation"),
    )


def _load_posts_from_supabase(config: SupabaseConfig) -> List[Post]:
    query = urlencode(
        {
            "select": "id,title,purpose,status,description,skill_requirements",
            "status": "eq.active",
            "order": "created_at.desc",
            "limit": "50",
        }
    )
    posts_url = f"{config.url}/rest/v1/posts?{query}"
    rows = _http_json(posts_url, headers=_supabase_headers(config.anon_key))
    posts: List[Post] = []
    for row in rows or []:
        title = str(row.get("title") or "Untitled Post")
        purpose = str(row.get("purpose") or "project")
        description = str(row.get("description") or "")
        skill_terms = _extract_post_skills(row.get("skill_requirements"))
        keyword_text = " ".join([title, purpose, description])
        posts.append(
            Post(
                post_id=str(row.get("id") or title),
                title=title,
                purpose=purpose,
                department="",
                required_skills=skill_terms,
                preferred_skills=[],
                description_keywords=_extract_description_keywords(keyword_text),
                status=str(row.get("status") or "active"),
            )
        )
    return posts


def _record_log(message: str, collector: List[str] | None = None) -> str:
    timestamp = datetime.now().strftime("%H:%M:%S")
    line = f"[{timestamp}] {message}"
    print(line)
    REQUEST_LOGS.append(line)
    del REQUEST_LOGS[:-MAX_LOG_LINES]
    if collector is not None:
        collector.append(line)
    return line


def _coerce_string_list(value: Any) -> List[str]:
    if isinstance(value, list):
        return [item for item in value if isinstance(item, str)]
    return []


def _profile_from_payload(payload: Dict[str, Any]) -> StudentProfile:
    return StudentProfile(
        student_id=str(payload.get("student_id") or payload.get("id") or "unknown-user"),
        name=str(payload.get("name") or "UnitEd User"),
        department=str(payload.get("department") or "Unknown"),
        skills=_coerce_string_list(payload.get("skills")),
        interests=_coerce_string_list(payload.get("interests")),
        year_of_graduation=payload.get("year_of_graduation"),
    )


def _post_from_payload(payload: Dict[str, Any]) -> Post:
    title = str(payload.get("title") or "Untitled Post")
    description = str(payload.get("description") or "")
    required_skills = _extract_post_skills(payload.get("skill_requirements"))
    preferred_skills = _coerce_string_list(payload.get("preferred_skills"))
    description_keywords = _coerce_string_list(payload.get("description_keywords"))
    if not description_keywords:
        description_keywords = _extract_description_keywords(" ".join([title, description, str(payload.get("purpose") or "")]))

    return Post(
        post_id=str(payload.get("post_id") or payload.get("id") or title),
        title=title,
        purpose=str(payload.get("purpose") or "project"),
        department=str(payload.get("department") or ""),
        required_skills=required_skills,
        preferred_skills=preferred_skills,
        description_keywords=description_keywords,
        status=str(payload.get("status") or "active"),
    )


class RecommendationRequestHandler(BaseHTTPRequestHandler):
    server_version = "UnitEdRecommendationBridge/1.0"

    def _send_json(self, status_code: int, payload: Dict[str, Any]) -> None:
        body = json.dumps(payload, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: Any) -> None:
        return

    def do_OPTIONS(self) -> None:
        self._send_json(200, {"status": "ok"})

    def do_GET(self) -> None:
        if self.path == "/health":
            self._send_json(
                200,
                {
                    "status": "ok",
                    "module": MODULE_NAME,
                    "version": MODULE_VERSION,
                    "pipeline": PIPELINE_NAME,
                },
            )
            return

        if self.path == "/logs":
            self._send_json(200, {"logs": REQUEST_LOGS[-50:]})
            return

        self._send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        if self.path != "/recommend":
            self._send_json(404, {"error": "Not found"})
            return

        request_logs: List[str] = []
        try:
            raw_length = self.headers.get("Content-Length", "0")
            content_length = int(raw_length)
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
            profile = _profile_from_payload(payload.get("profile") or {})
            posts = [_post_from_payload(item) for item in (payload.get("posts") or []) if isinstance(item, dict)]
            top_k = int(payload.get("top_k") or DEFAULT_TOP_K)

            _record_log(
                f"Received recommendation request for {profile.name} ({profile.student_id}) with {len(posts)} candidate posts.",
                request_logs,
            )

            recommendations = recommend_posts(profile, posts, top_k=top_k)
            for rank, recommendation in enumerate(recommendations, start=1):
                terms = ", ".join(recommendation.matched_terms) if recommendation.matched_terms else "none"
                match_percent = recommendation.cosine_score * 100
                _record_log(
                    f"Rank {rank}: {recommendation.title} | score={recommendation.cosine_score:.4f} | match={match_percent:.1f}% | matched={terms}",
                    request_logs,
                )

            if not recommendations:
                _record_log("No recommendations returned for this request.", request_logs)

            report = build_report(profile, posts, recommendations, top_k=top_k)
            self._send_json(
                200,
                {
                    "recommendations": [asdict(item) for item in recommendations],
                    "logs": request_logs,
                    "report": asdict(report),
                },
            )
        except Exception as exc:
            _record_log(f"Request failed: {exc}", request_logs)
            self._send_json(500, {"error": str(exc), "logs": request_logs})


def serve_recommendation_bridge(host: str, port: int) -> None:
    server = ThreadingHTTPServer((host, port), RecommendationRequestHandler)
    print(_render_banner())
    _record_log(f"Recommendation bridge listening on http://{host}:{port}")
    _record_log("Open Skill Matched Posts in the UI to send live recommendation requests.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        _record_log("Recommendation bridge stopped by user.")
    finally:
        server.server_close()


def _render_banner() -> str:
    return "\n".join(
        [
            "=" * 78,
            f"{MODULE_NAME} | {MODEL_NAME}",
            f"Pipeline: {PIPELINE_NAME} | Version: {MODULE_VERSION}",
            "=" * 78,
        ]
    )


def _print_run_context(
    profile: StudentProfile,
    posts: Sequence[Post],
    recommendations: Sequence[Recommendation],
    top_k: int,
    data_source: str,
) -> None:
    active_posts = [post for post in posts if post.status.lower() == "active"]
    print(_render_banner())
    print(f"Data Source        : {data_source}")
    print(f"Profile            : {profile.name} ({profile.student_id})")
    print(f"Department         : {profile.department}")
    print(f"Skills Indexed     : {len(_clean_terms(profile.skills))}")
    print(f"Interests Indexed  : {len(_clean_terms(profile.interests))}")
    print(f"Active Posts       : {len(active_posts)}")
    print(f"Requested Top K    : {top_k}")
    print(f"Results Generated  : {len(recommendations)}")
    print()


def _print_recommendations(profile: StudentProfile, recommendations: Sequence[Recommendation]) -> None:
    print(f"Top recommendations for {profile.name} ({profile.department})")
    print("-" * 78)
    for rank, item in enumerate(recommendations, start=1):
        matched = ", ".join(item.matched_terms) if item.matched_terms else "None"
        match_percent = item.cosine_score * 100
        print(f"{rank}. {item.title}")
        print(f"   Post ID       : {item.post_id}")
        print(f"   Cosine Score  : {item.cosine_score:.4f}")
        print(f"   Match Percent : {match_percent:.1f}%")
        print(f"   Matched Terms : {matched}")
        print(f"   Rationale     : {item.rationale}")
        print()


def _write_report(path: Path, report: RecommendationReport) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = asdict(report)
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"JSON report saved : {path}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run the UnitEd recommendation module for post ranking experiments."
    )
    parser.add_argument("--profile-file", type=Path, help="Path to a JSON file describing one student profile.")
    parser.add_argument("--posts-file", type=Path, help="Path to a JSON file containing post records.")
    parser.add_argument("--top-k", type=int, default=DEFAULT_TOP_K, help="Number of recommendations to return.")
    parser.add_argument(
        "--serve",
        action="store_true",
        help="Run the recommendation module as a local HTTP bridge for the frontend.",
    )
    parser.add_argument(
        "--host",
        default=DEFAULT_SERVER_HOST,
        help="Host for the local recommendation bridge.",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=DEFAULT_SERVER_PORT,
        help="Port for the local recommendation bridge.",
    )
    parser.add_argument(
        "--supabase-live",
        action="store_true",
        help="Fetch active posts from the project Supabase backend instead of local JSON files.",
    )
    parser.add_argument(
        "--supabase-email",
        help="Supabase account email for loading the authenticated user's profile.",
    )
    parser.add_argument(
        "--supabase-password",
        help="Supabase account password. If omitted with --supabase-email, the script prompts securely.",
    )
    parser.add_argument(
        "--output-json",
        type=Path,
        help="Optional path to export a structured recommendation report as JSON.",
    )
    parser.add_argument(
        "--demo",
        action="store_true",
        help="Run the recommendation module against bundled demonstration data.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    data_source = "Bundled demo dataset"

    if args.serve:
        serve_recommendation_bridge(args.host, args.port)
        return

    if args.demo:
        profile = _demo_profile()
        posts = _demo_posts()
    elif args.supabase_live:
        config = _resolve_supabase_config()
        posts = _load_posts_from_supabase(config)
        if args.supabase_email:
            password = args.supabase_password or getpass.getpass("Supabase password: ")
            profile = _load_profile_from_supabase(config, args.supabase_email, password)
            data_source = "Supabase live backend (authenticated profile + live posts)"
        elif args.profile_file:
            profile = _load_profile(args.profile_file)
            data_source = "Supabase live backend (live posts + local profile)"
        else:
            raise SystemExit(
                "For --supabase-live, provide --supabase-email or use --profile-file for the student profile."
            )
    else:
        if not args.profile_file or not args.posts_file:
            raise SystemExit(
                "Provide --demo, --supabase-live, or both --profile-file and --posts-file."
            )
        profile = _load_profile(args.profile_file)
        posts = _load_posts(args.posts_file)
        data_source = "Local JSON files"

    recommendations = recommend_posts(profile, posts, top_k=args.top_k)
    report = build_report(profile, posts, recommendations, top_k=args.top_k)
    _print_run_context(profile, posts, recommendations, top_k=args.top_k, data_source=data_source)
    _print_recommendations(profile, recommendations)
    if args.output_json:
        _write_report(args.output_json, report)


if __name__ == "__main__":
    main()
