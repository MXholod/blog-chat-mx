const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const upload = require('./../middleware/file-uploads');
const uploadOptimized = require('./../middleware/file-uploads-optimized');
const controller = require('./../controllers/post');
const { Router } = require('express');
const router = Router();

// /api/post/admin/create   -   create Post in Admin
router.post(
  '/admin/create',
  authCabinetAdmin,
  upload.single('imagePost'),
  uploadOptimized,
  controller.createPost
)

// /api/post/admin/posts   -   get all Posts in Admin
router.get(
  '/admin/posts',
  authCabinetAdmin,
  controller.getPosts
)

// /api/post/admin/post/:id   -   get Post by id in Admin
router.get(
  '/admin/post/:id',
  authCabinetAdmin,
  controller.getAdminPostById
)

// /api/post/admin/post/:id   -   update Post by id in Admin
router.put(
  '/admin/post/:id',
  authCabinetAdmin,
  upload.single('singleImage'),
  uploadOptimized,
  controller.updatePost
)

// /api/post/admin/post/:id   -   delete Post by id in Admin
router.delete(
  '/admin/post/:id',
  authCabinetAdmin,
  controller.deletePost
)

/*  Public  Routes */

// '/'  -   get all Posts on the Site
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  controller.getPosts
)

// '/:id'   -   get Post by id on the Site
router.get(
  '/:id',
  controller.getClientPostById
)
// '/:id'   -   add view to a Post by id on the Site
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  controller.addViewToPostById
)

module.exports = router
