import express from 'express';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';
import { deleteUser, getUser, getUserRole, getUsers, updateUser } from '../controllers/user.js';


const router = express.Router();

router.get('/', getUsers);
router.get('/:id', verifyUser, getUser);
router.put('/:id', verifyUser, updateUser);
router.delete('/:id', verifyAdmin, deleteUser);
router.get("/role/:id", getUserRole);

export default router;