import NotFoundError from '../../exceptions/NotFoundError.js';
import AlreadyExists from '../../exceptions/AlreadyExists.js';
import BadRequestError from '../../exceptions/BadRequestError.js';
import Project from '../../models/project.model.js';
import User from '../../models/user.model.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';
import Manager from '../../models/manager.model.js'

class ProjectController extends Controller {
    /**
     * GET /projects
     * 
     * @summary Get a list of all projects 
     * @tags Project
     * @security BearerAuth
     * 
     * @return { project.success }                  200 - success response
     * @return { message.unauthorized_error }       401 - UnauthorizedError
     * @return { message.server_error }             500 - Server Error
     */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query
            let searchQuery = {}
            if (query.length > 0) {
                searchQuery = {
                    $or: [
                        { name: { '$regex': query } },
                        { description: { '$regex': query } }
                    ]
                }
            }


            const projectList = await Project.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
                populate: [{ path: 'company_id', select: 'name' }],
            });
            AppResponse.builder(res).message("project.messages.project_found").data(projectList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /projects/{id}
     * 
     * @summary Get special project info
     * @tags Project
     * @security BearerAuth
     * 
     * @param  { string } id.path - project id
     * 
     * @return { message.unauthorized_error }       401 - UnauthorizedError
     * @return { message.server_error }             500 - Server Error
     */
    async find(req, res, next) {
        try {
            let project = await Project.findById(req.params.id).populate('created_by').exec();
            if (!project) throw new NotFoundError('project.errors.project_notfound');

            AppResponse.builder(res).message("project.messages.project_found").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /projects
     * 
     * @summary Create a new project
     * @tags Project
     * @security BearerAuth
     * 
     * @param  { project.create } request.body - project info - application/json
     * 
     * @return { project.success }                  201 - Project successful Created  
     * @return { message.unauthorized_error }       401 - UnauthorizedError
     * @return { message.badrequest_error }         400 - Bad Request
     * @return { message.server_error  }            500 - Server Error
     */
    async create(req, res, next) {
        try {
            let project = await Project.findOne({ 'name': req.body.name, 'company_id': req.body.company_id });
            if (project) throw new AlreadyExists('project.errors.project_already_attached_company');

            req.body.created_by = req.user_id;
            project = await Project.create(req.body);
            AppResponse.builder(res).status(201).message("project.messages.project_successfully_created").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    /**
     * PATCH /projects/{id}
     * 
     * @summary Update project info 
     * @tags Project
     * @security BearerAuth
     * 
     * @param  { string } id.path - project id
     * @param  { project.update } request.body - project info - application/json
     * 
     * @return { message.unauthorized_error }       401 - UnauthorizedError
     * @return { message.server_error }             500 - Server Error
     */
    async update(req, res, next) {
        try {
            let project = await Project.findOne({ 'name': req.body.name, 'company_id': req.body.company_id });
            if (project) throw new AlreadyExists('project.errors.project_already_attached_company');

            await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(project => AppResponse.builder(res).message("project.messages.project_successfully_updated").data(project).send())
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }

    /**
     * DELETE /projects/{id}
     * 
     * @summary Remove special project
     * @tags Project
     * @security BearerAuth
     * 
     * @param  { string } id.path - project id - application/json
     * 
     * @return { message.unauthorized_error }     401 - UnauthorizedError
     * @return { message.server_error } 500 - Server Error
     */
    async delete(req, res, next) {
        try {
            let project = await Project.findById(req.params.id);
            if (!project) throw new NotFoundError('project.errors.project_notfound');

            await project.delete(req.user_id);
            AppResponse.builder(res).message("project.messages.project_successfully_deleted").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    /**
      * PATCH /projects/{id}/manager
      *
      * @summary set manager for special project
      * @tags Project
      * @security BearerAuth
      *
      * @param  { string } id.path - project id - application/json
      * @param  { project.set_manager } request.body - project info - application/json
      *
      * @return { message.unauthorized_error }     401 - UnauthorizedError
      * @return { message.unauthorized_error }     404 - NotFoundError
      * @return { message.server_error }           500 - Server Error
      */
    async manager(req, res, next) {
        try {
            let project = await Project.findById(req.params.id);
            if (!project) throw new NotFoundError("project.errors.project_notfound");

            let user = await User.findById(req.body.manager_id);
            if (!user) throw new NotFoundError("user.errors.user_notfound");

            let manager = await Manager.findOne({ 'entity': "projects", 'entity_id': project.id, 'user_id': user.id });
            if (manager) throw new BadRequestError("project.errors.the_user_is_currently_an_manager_for_position");

            await Manager.create({ user_id: user._id, entity: "projects", entity_id: project._id, created_by: req.body.user_id });
            AppResponse.builder(res).status(201).message("project.messages.project_manager_successfully_updated").data(project).send();
        } catch (err) {
            next(err);
        }
    }
}

export default new ProjectController;