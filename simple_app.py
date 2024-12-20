from fastapi import FastAPI, Request
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

@app.get('/home')
async def gethome(request: Request):
    ctx = {'request': request}
    return str(ctx)

@app.get('/hi')
async def gethome(request: Request):
    return "Hello World.!"

@app.get('/buildnumber')
async def gethome(request: Request):
    return os.environ['BUILD_NUMBER']
