"""UnitEd recommendation utilities."""

from .post_recommender import (
    MODEL_NAME,
    MODULE_NAME,
    MODULE_VERSION,
    PIPELINE_NAME,
    Post,
    Recommendation,
    RecommendationReport,
    StudentProfile,
    build_report,
    recommend_posts,
)

__all__ = [
    "MODEL_NAME",
    "MODULE_NAME",
    "MODULE_VERSION",
    "PIPELINE_NAME",
    "Post",
    "Recommendation",
    "RecommendationReport",
    "StudentProfile",
    "build_report",
    "recommend_posts",
]
