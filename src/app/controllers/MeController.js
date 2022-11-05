const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class MeController {
    // [GET] /stored/courses
    storedCourses(req, res, next) {

        Promise.all([Course.find({}), Course.countDocumentsDeleted({})])
            .then(([course, countDeleted]) => 
                res.render('me/stored-courses', {
                    countDeleted,
                    courses: multipleMongooseToObject(course),
                })
            ) 
    }

    // [GET] /trash/courses
    trashCourses(req, res, next) {
        Course.findDeleted({})
            .then((course) =>
                res.render('me/trash-courses', {
                    courses: multipleMongooseToObject(course),
                }),
            )
            .catch(next);
    }
}
module.exports = new MeController();
