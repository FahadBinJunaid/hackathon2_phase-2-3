import asyncio
from sqlalchemy import text
from db import async_engine


async def test_connection():
    """Test database connection and create phase2 schema if needed."""
    try:
        async with async_engine.begin() as conn:
            # Test basic connection
            result = await conn.execute(text("SELECT 1"))
            print("[OK] Database connection successful!")

            # Create phase2 schema if it doesn't exist
            await conn.execute(text("CREATE SCHEMA IF NOT EXISTS phase2"))
            print("[OK] Schema 'phase2' created or already exists")

            # Verify schema exists
            result = await conn.execute(
                text("SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'phase2'")
            )
            schema = result.fetchone()
            if schema:
                print(f"[OK] Schema verification successful: {schema[0]}")

            return True
    except Exception as e:
        print(f"[ERROR] Database connection failed: {e}")
        return False


if __name__ == "__main__":
    success = asyncio.run(test_connection())
    exit(0 if success else 1)
