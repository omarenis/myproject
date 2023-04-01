import {AppDataSource} from "../data-source";
import {Person} from "../entity/Person";
import {Repository} from "typeorm";
const SECRET_KEY = process.env.SECRET_KEY;
const userRepository: Repository<Person> = AppDataSource.getRepository(Person);
import {compare, hash} from "bcrypt";
import PersonInterface from "../entityInterfaces/PersonInterface";

export async function login(email: string, password: string): Promise<Person> {
    const user: Person = await userRepository.findOneBy({email});
    if (user === null) {
        throw new Error('user not found with that email')
    }

    await compare(password, user.password,  (err: Error, result: boolean) =>{
            if( !result)
            {
                throw new Error('password does not match with the server');
            }
        }
    );
    return user;
}
export async function signup(person: PersonInterface): Promise<Person>
{
    const personObject: Person = new Person();
    personObject.firstname = person.firstname;
    personObject.lastname = person.lastname;
    personObject.email = person.email;
    await hash(person.password, SECRET_KEY,  (err: Error, encrypted: string): void => {
        personObject.password = encrypted;
    });
    return personObject;
}

