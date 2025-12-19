import { getFirestore, collection, addDoc } from "firebase/firestore";

// 1. Initialize the database
const db = getFirestore();

// 2. Data to be added (Notice how it's just a flexible object)
const userData = {
  name: "Jane Doe",
  email: "jane@example.com",
  interests: ["coding", "hiking", "photography"], // Arrays are easy in NoSQL!
  createdAt: new Date()
};

// 3. Add a new document to the "users" collection
try {
  const docRef = await addDoc(collection(db, "users"), userData);
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}