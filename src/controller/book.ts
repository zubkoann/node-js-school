import {BaseContext} from 'koa';
import {Equal, getManager, Not, Repository} from 'typeorm';
import {validate, ValidationError} from 'class-validator';
import {User} from '../entity/user';
import {Book} from '../entity/book';

export default class BookController {
    public static async getUserBooks(ctx: BaseContext) {
        // get a user books and user to perform operations with books and user
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        const userRepository: Repository<User> = getManager().getRepository(User);
        const user: User = await userRepository.findOne(+ctx.params.id);
        if (!user) {
            ctx.status = 404;
            ctx.body = 'The user does\'t exist in datebase';
            return;
        }
        // load user's book
        const userBooks: Book[] = await bookRepository.find({where: {user: user.id}});
        // return OK status code and loaded user's books array
        ctx.status = 200;
        ctx.body = userBooks;
    }

    public static async createUserBook(ctx: BaseContext) {
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        const userRepository: Repository<User> = getManager().getRepository(User);

        const user: User = await userRepository.findOne(+ctx.params.id);
        if (!user) {
            // return BAD REQUEST status code and errors array
            ctx.status = 404;
            ctx.body = 'The user does\'t exist in datebase';
            return;
        }

        const bookToBeSaved: Book = new Book();
        bookToBeSaved.name = ctx.request.body.name;
        bookToBeSaved.description = ctx.request.body.description;
        bookToBeSaved.date = ctx.request.body.date;
        const errors: ValidationError[] = await validate(bookToBeSaved); // errors is an array of validation errors
        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
            return;
        } else if (await userRepository.findOne({name: bookToBeSaved.name})) {
            // return BAD REQUEST status code and book already exists error
            ctx.status = 400;
            ctx.body = 'The name of book already exists';
        }
        bookToBeSaved.user = user;
        // save the book contained in the POST body
        const newBook = await bookRepository.save(bookToBeSaved);
        ctx.status = 201;
        ctx.body = newBook;
    }

    public static async updateUserBook(ctx: BaseContext) {
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        const bookToBeUpdate: Book = await bookRepository.findOne({
            where: {
                id: +ctx.params.bookId || 0,
                user: ctx.params.id || 0
            }
        });
        if (!bookToBeUpdate) {
            // return BAD REQUEST status code and errors array
            ctx.status = 404;
            ctx.body = 'The user or book does\'t exist in datebase';
            return;
        }
        bookToBeUpdate.name = ctx.request.body.name;
        bookToBeUpdate.description = ctx.request.body.description;
        bookToBeUpdate.date = ctx.request.body.date;
        const errors: ValidationError[] = await validate(bookToBeUpdate); // errors is an array of validation errors
        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        } else if (await bookRepository.findOne({id: Not(Equal(bookToBeUpdate.id)), name: bookToBeUpdate.name})) {
            // return BAD REQUEST status code and book already exists error
            ctx.status = 400;
            ctx.body = 'The name of book already exists';
        }
        // update the book contained in the PUT body
        const updateBook = await bookRepository.save(bookToBeUpdate);
        ctx.status = 201;
        ctx.body = updateBook;
    }

    public static async deleteUserBook(ctx: BaseContext) {
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        const bookToRemove: Book = await bookRepository.findOne({
            where: {
                id: +ctx.params.bookId || 0,
                user: ctx.params.id || 0
            }
        });
        if (!bookToRemove) {
            // return BAD REQUEST status code and errors array
            ctx.status = 404;
            ctx.body = 'The book or user does\'t exist in datebase';
            return;
        } else {
            await bookRepository.remove(bookToRemove);
            // return a NO CONTENT status code
            ctx.status = 204;
        }
    }
}