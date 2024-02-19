// controllers/studentsController.js

import Student from './student.model'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

exports.registerStudent = async (req, res) => {
    try {
      const { username, password } = req.body;
      const student = await Student.create({ username, password });
      res.status(201).json(student);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.loginStudent = async (req, res) => {
    // Implementar lógica de inicio de sesión para estudiantes
  };
  
  exports.assignCourse = async (req, res) => {
    try {
      const { courseId } = req.body;
      const studentId = req.user.id; // Suponiendo que el ID del estudiante está en el token de autenticación
      const student = await Student.findById(studentId);
      if (student.assignedCourses.length >= 3) {
        return res.status(400).json({ message: "El estudiante ya tiene asignados el máximo de cursos permitidos." });
      }
      if (student.assignedCourses.includes(courseId)) {
        return res.status(400).json({ message: "El estudiante ya está asignado a este curso." });
      }
      student.assignedCourses.push(courseId);
      await student.save();
      res.status(200).json(student);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.viewAssignedCourses = async (req, res) => {
    try {
      const studentId = req.user.id; // Suponiendo que el ID del estudiante está en el token de autenticación
      const student = await Student.findById(studentId).populate('assignedCourses');
      res.status(200).json(student.assignedCourses);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.editProfile = async (req, res) => {
    try {
      const studentId = req.user.id; // Suponiendo que el ID del estudiante está en el token de autenticación
      const { username, password } = req.body;
      await Student.findByIdAndUpdate(studentId, { username, password });
      res.status(200).json({ message: "Perfil actualizado correctamente." });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.deleteProfile = async (req, res) => {
    try {
      const studentId = req.user.id; // Suponiendo que el ID del estudiante está en el token de autenticación
      await Student.findByIdAndDelete(studentId);
      res.status(200).json({ message: "Perfil eliminado correctamente." });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };