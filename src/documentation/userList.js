/**
 * @openapi
 * /api/v1/users/list:
 *   get:
 *     summary: Retrieve a list of users
 *     description: >
 *      Fetch a paginated list of users. Some query parameters require specific permissions. In ORDER to be
 *      able to retrieve private users you need a role with the permission VIEW_PRIVATE_USERS, to get the deleted users VIEW_DELETED_USERS
 *      and for banned users VIEW_BANNED_USERS
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of users to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of users to skip
 *       - in: query
 *         name: showPrivateUsers
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include private users (requires permission)
 *       - in: query
 *         name: showDeletedUsers
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include soft-deleted users (requires permission)
 *       - in: query
 *         name: showBannedUsers
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include banned users (requires permission)
 *     responses:
 *       200:
 *         description: Users successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Users successfully retrieved."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         rol_id:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: "sunless_admin"
 *                         password:
 *                           type: string
 *                           example: "****"
 *                         profile_photo:
 *                           type: string
 *                           nullable: true
 *                         phone:
 *                           type: string
 *                           nullable: true
 *                         email:
 *                           type: string
 *                           nullable: true
 *                         public:
 *                           type: boolean
 *                           example: true
 *                         banned:
 *                           type: boolean
 *                           example: false
 *                         deleted:
 *                           type: boolean
 *                           example: false
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-08-14T19:55:11.121Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-08-14T19:55:11.121Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid request"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "field"
 *                       value:
 *                         type: string
 *                         example: ""
 *                       msg:
 *                         type: string
 *                         example: "'limit' must be a number"
 *                       path:
 *                         type: string
 *                         example: "limit"
 *                       location:
 *                         type: string
 *                         example: "query"
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "You must provide a token"
 *                 data:
 *                   type: array
 *                   items: {}
 *       403:
 *         description: Forbidden, insufficient permissions or user is banned/deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: "You shall not pass!"
 *                 data:
 *                   type: array
 *                   items: {}
 */
