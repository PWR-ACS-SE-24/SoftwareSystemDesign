from fastapi import FastAPI, status
import uvicorn

app = FastAPI()


@app.get("/int/v1/health")
def health() -> dict:
    return {"status": "UP"}


@app.get("/int/v1/vehicles/{side_number}/route")
def get_vehicle_route(side_number: str) -> dict:
    return {"id": "00000000-0000-0000-0000-000000000000", "lineName": "Line 1"}


@app.post("/int/v1/charge")
def charge_user(data: dict, status_code=status.HTTP_202_ACCEPTED) -> dict:
    return {}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8081)
