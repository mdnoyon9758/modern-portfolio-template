from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.api import deps
from app.services.contact_message import contact_message
from app.services.email import send_contact_notification, send_test_email

router = APIRouter()


@router.post("/", response_model=schemas.MessageResponse)
async def create_contact_message(
    *,
    db: Session = Depends(deps.get_db),
    contact_in: schemas.ContactMessageCreate,
    background_tasks: BackgroundTasks,
) -> Any:
    """
    Create new contact message and send email notification.
    """
    # Save message to database
    message = contact_message.create(db=db, obj_in=contact_in)
    
    # Send email notification in background
    background_tasks.add_task(
        send_contact_notification,
        contact_in.name,
        contact_in.email,
        contact_in.subject or "Contact Form Submission",
        contact_in.message
    )
    
    return {"message": "Your message has been sent successfully!"}


@router.get("/", response_model=List[schemas.ContactMessage])
def read_contact_messages(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve contact messages (admin only).
    """
    messages = contact_message.get_multi(db, skip=skip, limit=limit)
    return messages


@router.get("/unread", response_model=List[schemas.ContactMessage])
def read_unread_contact_messages(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve unread contact messages (admin only).
    """
    messages = contact_message.get_unread(db)
    return messages


@router.get("/unreplied", response_model=List[schemas.ContactMessage])
def read_unreplied_contact_messages(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve unreplied contact messages (admin only).
    """
    messages = contact_message.get_unreplied(db)
    return messages


@router.get("/{id}", response_model=schemas.ContactMessage)
def read_contact_message(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get contact message by ID (admin only).
    """
    message = contact_message.get(db=db, id=id)
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    return message


@router.put("/{id}", response_model=schemas.ContactMessage)
def update_contact_message(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    message_in: schemas.ContactMessageUpdate,
) -> Any:
    """
    Update a contact message (admin only).
    """
    message = contact_message.get(db=db, id=id)
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    message = contact_message.update(db=db, db_obj=message, obj_in=message_in)
    return message


@router.post("/{id}/read", response_model=schemas.ContactMessage)
def mark_message_as_read(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Mark contact message as read (admin only).
    """
    message = contact_message.get(db=db, id=id)
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    message = contact_message.mark_as_read(db=db, db_obj=message)
    return message


@router.post("/{id}/replied", response_model=schemas.ContactMessage)
def mark_message_as_replied(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Mark contact message as replied (admin only).
    """
    message = contact_message.get(db=db, id=id)
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    message = contact_message.mark_as_replied(db=db, db_obj=message)
    return message


@router.post("/test-email", response_model=schemas.MessageResponse)
async def test_email_configuration() -> Any:
    """
    Test email configuration by sending a test email.
    """
    success = await send_test_email()
    if success:
        return {"message": "Test email sent successfully!"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send test email")


@router.delete("/{id}", response_model=schemas.ContactMessage)
def delete_contact_message(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Delete a contact message (admin only).
    """
    message = contact_message.get(db=db, id=id)
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    message = contact_message.remove(db=db, id=id)
    return message
