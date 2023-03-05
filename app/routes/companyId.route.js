import express from 'express'

import CompanyController from '../http/controllers/company.controller.js'
import CompanyValidation from '../validators/company.validation.js'
import { Upload } from '../helper/upload.js';

const companyIdRouter = express.Router({mergeParams: true});

companyIdRouter
    .get('', CompanyValidation.find(), CompanyController.find)
    .patch('', CompanyValidation.update(), CompanyController.update)
    .delete('', CompanyValidation.remove(), CompanyController.delete)
    .patch('/manager', CompanyValidation.manager(), CompanyController.manager)
    .delete('/manager', CompanyValidation.deleteManager(), CompanyController.deleteManager)
    .get('/resumes', CompanyValidation.find(), CompanyController.getResumes)
    .get('/managers', CompanyValidation.find(), CompanyController.getManagers)
    .get('/projects', CompanyValidation.find(), CompanyController.getProjects)
    .patch('/logo', Upload('companies', 'logo', 'image'), CompanyValidation.logo(), CompanyController.updateLogo)
    .patch('/active', CompanyValidation.active(), CompanyController.active)
    .patch('/deactive', CompanyValidation.deActive(), CompanyController.deActive)

export default companyIdRouter