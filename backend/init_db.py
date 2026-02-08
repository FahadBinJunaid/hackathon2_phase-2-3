import asyncio
from sqlmodel import SQLModel
from sqlalchemy import text
from db import async_engine
from models.user import User
from models.todo import Todo


async def create_tables():
    """Create all database tables in the phase2 schema."""
    try:
        async with async_engine.begin() as conn:
            # Ensure phase2 schema exists
            await conn.execute(text("CREATE SCHEMA IF NOT EXISTS phase2"))
            print("[OK] Schema 'phase2' verified")

            # Create all tables
            await conn.run_sync(SQLModel.metadata.create_all)
            print("[OK] All tables created successfully")

            # Verify users table exists
            result = await conn.execute(
                text("""
                    SELECT table_name
                    FROM information_schema.tables
                    WHERE table_schema = 'phase2'
                    AND table_name = 'users'
                """)
            )
            table = result.fetchone()
            if table:
                print(f"[OK] Table verification successful: phase2.{table[0]}")

                # Verify columns
                result = await conn.execute(
                    text("""
                        SELECT column_name, data_type, is_nullable
                        FROM information_schema.columns
                        WHERE table_schema = 'phase2'
                        AND table_name = 'users'
                        ORDER BY ordinal_position
                    """)
                )
                columns = result.fetchall()
                print("[OK] Users table columns:")
                for col in columns:
                    print(f"  - {col[0]}: {col[1]} (nullable: {col[2]})")

            # Verify todos table exists
            result = await conn.execute(
                text("""
                    SELECT table_name
                    FROM information_schema.tables
                    WHERE table_schema = 'phase2'
                    AND table_name = 'todos'
                """)
            )
            table = result.fetchone()
            if table:
                print(f"[OK] Table verification successful: phase2.{table[0]}")

                # Verify columns
                result = await conn.execute(
                    text("""
                        SELECT column_name, data_type, is_nullable
                        FROM information_schema.columns
                        WHERE table_schema = 'phase2'
                        AND table_name = 'todos'
                        ORDER BY ordinal_position
                    """)
                )
                columns = result.fetchall()
                print("[OK] Todos table columns:")
                for col in columns:
                    print(f"  - {col[0]}: {col[1]} (nullable: {col[2]})")

                # Verify foreign key constraint
                result = await conn.execute(
                    text("""
                        SELECT
                            tc.constraint_name,
                            kcu.column_name,
                            ccu.table_schema AS foreign_table_schema,
                            ccu.table_name AS foreign_table_name,
                            ccu.column_name AS foreign_column_name
                        FROM information_schema.table_constraints AS tc
                        JOIN information_schema.key_column_usage AS kcu
                            ON tc.constraint_name = kcu.constraint_name
                            AND tc.table_schema = kcu.table_schema
                        JOIN information_schema.constraint_column_usage AS ccu
                            ON ccu.constraint_name = tc.constraint_name
                            AND ccu.table_schema = tc.table_schema
                        WHERE tc.constraint_type = 'FOREIGN KEY'
                            AND tc.table_schema = 'phase2'
                            AND tc.table_name = 'todos'
                    """)
                )
                fk = result.fetchone()
                if fk:
                    print(f"[OK] Foreign key constraint: {fk[1]} -> {fk[2]}.{fk[3]}.{fk[4]}")

            return True
    except Exception as e:
        print(f"[ERROR] Table creation failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = asyncio.run(create_tables())
    exit(0 if success else 1)
