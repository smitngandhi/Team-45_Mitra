from pymongo import MongoClient
import os
from langchain.chat_models import ChatOpenAI
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from app.config import Config




# Initialize MongoDB connection
client = MongoClient(os.getenv("MONGO_URL"))
db = client["mydatabase"]


# Collections
users_collection = db["users"]
chats_collection = db["chats"]

# Initialize Together.AI-powered LLM

llm = ChatOpenAI(
    model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    openai_api_key="3dbf00d2e4776e119e094fcfd9287265613f31fa154990452da4f12eff98aca3",
    openai_api_base="https://api.together.xyz/v1",
)