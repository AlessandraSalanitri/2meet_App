"use server";

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

// Fetch all users
export async function fetchAllUsers() {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const usersList = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return usersList;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users.");
  }
}

// Add a new user
export async function addUser(user) {
  try {
    const newUserDoc = await addDoc(collection(db, "users"), user);
    return { id: newUserDoc.id, ...user };
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Failed to add user.");
  }
}

// Update an existing user
export async function updateUser(userId, updatedFields) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updatedFields);
    return { id: userId, ...updatedFields };
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user.");
  }
}

// Cancel a user
export async function deleteUser(userId) {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    return userId;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user.");
  }
}
