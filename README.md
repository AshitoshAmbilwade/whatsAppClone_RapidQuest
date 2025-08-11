# whatsAppClone_RapidQuest
This is Assessment provided by RapidQuest to build the whatsapp clone 

## 📡 Backend URL
[https://whatsappclone-rapidquest.onrender.com/](https://whatsappclone-rapidquest.onrender.com/)

see we just build the socket connection but we do not create the room and connection between the Ravi and Neha
currently you can see we can sen message and it will send to the database and can fetch also
to see in the database please change the MONGODB URL by creating .env and update your URL.
then you can get the DB whatsapp and the collection proceed_messages where you can find the messages

also I follow all the steps and evaluation criteria:

Task 1: Webhook Payload Processor
Here is a zip file with sample payloads (JSON files) that simulate WhatsApp Business API 
webhooks:  
Download It here:  https://drive.google.com/file/d/1pWZ9HaHLza8k080pP_GhvKIl8j2voy
U/view?usp=sharing 
• Write a script to: 
o Read these payloads 
o Insert new messages into the MongoDB collection: 
Database: whatsapp 
Collection: processed_messages 
o Use the status payloads (sent, delivered, read) to update the status of each 
corresponding message using the id or meta_msg_id field

2.Task 2: WhatsApp Web–Like Interface 
• Create a frontend UI similar to WhatsApp Web 
• Show all conversations grouped by user (wa_id) 
• Clicking a chat should show: 
o All message bubbles with date time 
o Status indicators (sent, delivered, read) 
o Basic user info (name and number) 
• Design should be: 
o Clean 
o Responsive 
o Easy to use on mobile and desktop

3.Task 3: Send Message (Demo) 
• Add a “Send Message” input box like WhatsApp Web 
• On submit, the message should: 
o Show up in the conversation UI 
o Be saved to the database (processed_messages) 
o No message will actually be sent outside the platform 
Task 4: Deployment 
Host the complete app on a public URL You may use: Vercel, Render, Heroku, Or any other hosting 
provider 
• Do not submit code-only repositories or localhost URLs 
• Demo must be accessible publicly without setup 

 also implemented Real-Time Interface Using WebSocket 
Simulate real-time message updates using WebSocket (e.g., Socket.IO). Your frontend should 
automatically reflect new messages and status updates as they are inserted or updated in the 
database, without requiring a manual refresh.

and complete the project
