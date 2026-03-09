# UnitEd Recommendation Module

This folder contains the standalone recommendation workflow used for UnitEd post-ranking experiments.

## Contents

- `post_recommender.py`: cosine-similarity ranking pipeline
- `sample_profile.json`: example student profile input
- `sample_posts.json`: example post dataset
- `output/`: optional generated reports

## Run Demo

```bash
python tools/recommendation/post_recommender.py --demo
```

## Export JSON Report

```bash
python tools/recommendation/post_recommender.py --demo --output-json tools/recommendation/output/demo_report.json
```

## Run Against Project Supabase

```bash
python tools/recommendation/post_recommender.py --supabase-live --profile-file tools/recommendation/sample_profile.json --top-k 5
```

## Run With Your Authenticated Supabase Profile

```bash
python tools/recommendation/post_recommender.py --supabase-live --supabase-email your-email@example.com --top-k 5
```

If no password is passed with `--supabase-password`, the script prompts for it securely.

## Run As a Local UI Bridge

```bash
python tools/recommendation/post_recommender.py --serve
```

While this process is running, the Skill Matched Posts page can call the bridge on `http://127.0.0.1:8765`, use the Python ranking output, and display the same per-request logs that appear in the terminal.

The module is intentionally standalone so the main application behavior remains unchanged.
