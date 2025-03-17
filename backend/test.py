import modal
import json


def load_json_leaderboard():
    volume = modal.Volume.from_name("face-database")
    metadata = volume.read_file("metadata.json")
    db = list(metadata)[0]
    leaderboard = json.loads(db)
    return leaderboard


print(load_json_leaderboard())
