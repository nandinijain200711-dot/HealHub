#!/usr/bin/env python3
"""
Database initialization script for HealHub Backend
Creates default admin user and sample data
"""

import asyncio
import sys
from datetime import datetime
# from motor.motor_asyncio import AsyncClient
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.core.security import hash_password

async def init_database():
    """Initialize database with default data"""
    
    print("🚀 Initializing HealHub Database...")
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        db = client[settings.DATABASE_NAME]
        
        # Test connection
        await client.admin.command("ping")
        print("✅ Connected to MongoDB")
        
        # Create admin user
        admin_collection = db["admins"]
        
        admin_exists = await admin_collection.find_one({"username": settings.ADMIN_USERNAME})
        if admin_exists:
            print("⚠️  Admin user already exists")
        else:
            admin_data = {
                "username": settings.ADMIN_USERNAME,
                "email": settings.ADMIN_EMAIL,
                "full_name": "Administrator",
                "hashed_password": hash_password(settings.ADMIN_PASSWORD),
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            result = await admin_collection.insert_one(admin_data)
            print(f"✅ Admin user created: {result.inserted_id}")
        
        # Create sample FAQs
        faq_collection = db["faqs"]
        sample_faqs = [
            {
                "question": "What is HealHub?",
                "answer": "HealHub is an AI-powered healthcare platform that provides health consultations, appointment booking, and medical guidance.",
                "category": "General",
                "order": 1,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "question": "How do I book an appointment?",
                "answer": "Navigate to the Appointment Booking section, fill in your details, and select your preferred date and time.",
                "category": "Appointments",
                "order": 1,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "question": "Is the AI chatbot a replacement for professional medical advice?",
                "answer": "No, the AI chatbot provides general health information only and is not a substitute for professional medical advice.",
                "category": "Safety",
                "order": 1,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "question": "How is my data protected?",
                "answer": "We use industry-standard encryption and security measures to protect all user data.",
                "category": "Security",
                "order": 1,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        faq_count = await faq_collection.count_documents({})
        if faq_count == 0:
            result = await faq_collection.insert_many(sample_faqs)
            print(f"✅ Sample FAQs created: {len(result.inserted_ids)}")
        else:
            print(f"⚠️  FAQs already exist: {faq_count} documents")
        
        # Create sample doctors
        doctor_collection = db["doctors"]
        sample_doctors = [
            {
                "name": "Dr. Sarah Johnson",
                "specialization": "General Practice",
                "email": "sarah.johnson@healhub.com",
                "phone": "+1-555-0101",
                "experience_years": 10,
                "bio": "Experienced general practitioner with a focus on patient care.",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Dr. Michael Chen",
                "specialization": "Cardiology",
                "email": "michael.chen@healhub.com",
                "phone": "+1-555-0102",
                "experience_years": 15,
                "bio": "Specialist in cardiovascular diseases with extensive research background.",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Dr. Emily Williams",
                "specialization": "Dermatology",
                "email": "emily.williams@healhub.com",
                "phone": "+1-555-0103",
                "experience_years": 8,
                "bio": "Dermatology specialist providing comprehensive skin care solutions.",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        doctor_count = await doctor_collection.count_documents({})
        if doctor_count == 0:
            result = await doctor_collection.insert_many(sample_doctors)
            print(f"✅ Sample doctors created: {len(result.inserted_ids)}")
        else:
            print(f"⚠️  Doctors already exist: {doctor_count} documents")
        
        # Create contact information
        contact_collection = db["contact"]
        contact_exists = await contact_collection.find_one({})
        if contact_exists:
            print("⚠️  Contact information already exists")
        else:
            contact_data = {
                "address": "123 Healthcare Avenue, Medical City, MC 12345",
                "phone": "+1-555-0000",
                "email": settings.ADMIN_EMAIL,
                "business_hours": "Monday - Friday: 9:00 AM - 5:00 PM",
                "emergency_contact": "+1-555-9999",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            result = await contact_collection.insert_one(contact_data)
            print(f"✅ Contact information created: {result.inserted_id}")
        
        # Create website content
        content_collection = db["website_content"]
        content_exists = await content_collection.find_one({})
        if content_exists:
            print("⚠️  Website content already exists")
        else:
            content_data = {
                "home_headline": "Welcome to HealHub",
                "home_subheading": "Your AI-Powered Healthcare Platform",
                "about_content": "HealHub is dedicated to providing accessible healthcare services with the help of artificial intelligence.",
                "benefits_title": "Why Choose HealHub?",
                "benefits_list": [
                    "AI-Powered Health Consultations",
                    "Easy Appointment Booking",
                    "Expert Medical Professionals",
                    "24/7 Chatbot Support",
                    "Secure Patient Records",
                    "Affordable Services"
                ],
                "testimonials": [
                    {
                        "name": "John Doe",
                        "text": "Great service! The AI chatbot helped me understand my symptoms.",
                        "rating": 5
                    },
                    {
                        "name": "Jane Smith",
                        "text": "Easy to use platform and quick appointment booking.",
                        "rating": 5
                    }
                ],
                "updated_at": datetime.utcnow()
            }
            result = await content_collection.insert_one(content_data)
            print(f"✅ Website content created: {result.inserted_id}")
        
        # Create indexes
        print("\n📊 Creating database indexes...")
        
        await admin_collection.create_index("username", unique=True)
        await admin_collection.create_index("email", unique=True)
        print("✅ Admin indexes created")
        
        db_users = db["users"]
        await db_users.create_index("email", unique=True)
        print("✅ User indexes created")
        
        appointment_collection = db["appointments"]
        await appointment_collection.create_index("user_email")
        await appointment_collection.create_index("appointment_date")
        print("✅ Appointment indexes created")
        
        chat_collection = db["chat_sessions"]
        await chat_collection.create_index("user_email")
        await chat_collection.create_index("created_at")
        print("✅ Chat session indexes created")
        
        await faq_collection.create_index([("category", 1), ("order", 1)])
        print("✅ FAQ indexes created")
        
        print("\n✨ Database initialization completed successfully!\n")
        print("📝 Default Admin Credentials:")
        print(f"   Username: {settings.ADMIN_USERNAME}")
        print(f"   Email: {settings.ADMIN_EMAIL}")
        print(f"   Password: [Check .env file]\n")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error initializing database: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    print("\n" + "="*50)
    print("HealHub Database Initialization")
    print("="*50 + "\n")
    
    asyncio.run(init_database())
