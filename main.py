from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def read():
    return "hello world"