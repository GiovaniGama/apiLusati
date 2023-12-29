import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ContactsToGroup from 'App/Models/ContactsToGroup';

export default class ContactsToGroupController{
    public async show({ params }: HttpContextContract) {

        const contactsToGroup = await ContactsToGroup.query().where('contato_id', params.id)
    
        return contactsToGroup;
    
    }
}