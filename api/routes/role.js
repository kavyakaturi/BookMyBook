import express from 'express';
import {createRole,deleteRole,getAllRoles,updateRole} from '../controllers/role.controller.js';
import {verifyAdmin,verifyUser} from '../utils/verifyToken.js';


const router = express.Router();

router.post('/create',verifyAdmin,createRole);

router.put('/update/:id',updateRole);

router.get('/getAll',getAllRoles);

router.delete('/delete/:id',deleteRole);

export default router;