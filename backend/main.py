from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import modal
import json
from fastapi import FastAPI, Response
import base64


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


def load_json_leaderboard():
    volume = modal.Volume.from_name("face-database")
    metadata = volume.read_file("metadata.json")
    db = list(metadata)[0]
    leaderboard = json.loads(db)
    return leaderboard


def get_image(image_path: str) -> bytes:
    volume = modal.Volume.from_name("face-database")
    image = volume.read_file(image_path)
    image = list(image)[0]
    return image


@app.get("/leaderboard")
async def get_leaderboard():
    data = load_json_leaderboard()
    return JSONResponse(
        content=data,
        headers={
            "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
            "pragma": "no-cache",
            "expires": "0",
        },
    )


@app.get("/image/{image_path}")
async def get_image_endpoint(image_path: str):
    image = get_image(image_path)
    base64_image = base64.b64encode(image).decode()

    return Response(content=image, media_type="image/jpeg")

    # return {"image": f"data:image/jpeg;base64,{base64_image}"}
