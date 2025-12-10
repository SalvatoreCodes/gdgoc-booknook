import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

export const useAddBook = async (id, title, author, isbn, description) => {
  try {
    const docRef = await addDoc(collection(db, "books"), {
      id,
      title,
      author,
      isbn,
      description
    })
    console.log("Document written with ID: ", docRef.id)
  } catch (e) {
    console.error("Error adding document: ", e)
  }
}