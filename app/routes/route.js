import express from 'express'
import { verifyToken } from '../middlewares/auth.middleware.js'
import projectRouter from './project.route.js'
import resumeRouter from './resume.route.js'
import authRouter from './auth.route.js'
import userRouter from './user.route.js'
import companyRouter from './company.route.js'
import constantRouter from './constant.route.js'
import provinceRouter from './province.route.js'
import cityRouter from './city.route.js'
import positionRouter from './position.route.js'
import { canAccess } from '../middlewares/rbac.middleware.js'
import companyIdRouter from './companyId.route.js'
import { companyAccess } from '../middlewares/companyAccess.middleware.js'
import projectIdRouter from './projectId.route.js'
import { projectAccess } from '../middlewares/projectAccess.middleware.js'
import permissionRouter from './permission.route.js'
import permissionIdRouter from './permissionId.route.js'
import roleIdRouter from './roleId.route.js'
import roleRouter from './role.route.js'


const router = express.Router();

router.use('/auth', authRouter)
router.use('/users', verifyToken, userRouter)
router.use('/companies/:id', verifyToken, canAccess, companyAccess, companyIdRouter)
router.use('/companies', verifyToken, canAccess, companyAccess, companyRouter)
router.use('/projects/:id', verifyToken, canAccess, projectAccess, projectIdRouter)
router.use('/projects', verifyToken, canAccess, projectAccess, projectRouter)
router.use('/permissions/:id', verifyToken, canAccess, permissionIdRouter)
router.use('/permissions', verifyToken, canAccess, permissionRouter)
router.use('/roles/:id', verifyToken, canAccess, roleIdRouter)
router.use('/roles', verifyToken, canAccess, roleRouter)
router.use('/resumes', verifyToken, resumeRouter)
router.use('/constant', verifyToken,constantRouter)
router.use('/provinces', verifyToken,provinceRouter)
router.use('/cities', verifyToken,cityRouter)
router.use('/positions', verifyToken,positionRouter)

export default router;