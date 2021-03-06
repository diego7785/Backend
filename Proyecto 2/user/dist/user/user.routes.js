"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_entity_1 = require("../database/entities/user.entity");
const user_repository_1 = require("../database/repository/user.repository");
class UserRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.userRepository = new user_repository_1.UserRepository();
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.name || !req.body.nickname) {
                res.status(400).send({
                    message: 'Name and nickname are required'
                });
            }
            else {
                const { name, nickname } = req.body;
                const user = new user_entity_1.User();
                user.name = name;
                user.nickname = nickname;
                yield this.userRepository.createUser(user);
                res.status(201).send({ data: user });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.name && !req.query.nickname) {
                const users = yield this.userRepository.getAllUsersSimplified();
                res.status(200).send({ data: users });
            }
            else {
                const { name, nickname } = req.query;
                const filteredUsers = yield this.userRepository.filterByNameAndNickname(name, nickname);
                if (filteredUsers.length > 0) {
                    res.status(200).send({ data: filteredUsers });
                }
                else {
                    res.status(404).send({ data: "User not found" });
                }
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield this.userRepository.getUser(id);
            if (user) {
                res.status(200).send({ data: user });
            }
            else {
                res.status(404).send({ data: "User not found" });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const deleted = yield this.userRepository.deleteUser(id);
            if (deleted.affected === 1) {
                res.status(200).send({ data: "User deleted" });
            }
            else {
                res.status(404).send({ data: "User not found" });
            }
        });
    }
    patchUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateInfo = req.body;
            const { id } = req.params;
            const updatedUser = yield this.userRepository.patchUser(id, updateInfo);
            if (updatedUser) {
                res.status(200).send({ data: "User updated" });
            }
            else {
                res.status(404).send({ data: "User not found" });
            }
        });
    }
    routes() {
        this.router.post("/", (req, res) => {
            this.createUser(req, res);
        });
        this.router.get("/", (req, res) => {
            this.getAllUsers(req, res);
        });
        this.router.get("/:id", (req, res) => {
            this.getUser(req, res);
        });
        this.router.delete("/:id", (req, res) => {
            this.deleteUser(req, res);
        });
        this.router.patch("/:id", (req, res) => {
            this.patchUser(req, res);
        });
        return this.router;
    }
}
exports.default = UserRoutes;
//# sourceMappingURL=user.routes.js.map