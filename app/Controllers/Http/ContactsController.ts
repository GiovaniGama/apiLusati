import Contacts from "App/Models/Contacts";
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ContactsValidator from "App/Validators/ContactsValidator";
import Database from "@ioc:Adonis/Lucid/Database";

export default class ContactsController{
    
    public async index({ request, response }: HttpContextContract) {
        const { term } = request.qs();
      
        let contactsQuery = Contacts.query()
          .whereNotNull('ds_contato')
          .whereNotNull('nr_celular')
          .whereNotNull('ds_email')
          .whereNotNull('st_ativo')
          .orderBy('id', 'desc');
      
        if (term) {
          contactsQuery.where((query) => {
            query.where('ds_contato', 'LIKE', `%${term}%`)
                .orWhere('nr_celular', 'LIKE', `%${term}%`);
          });
        }
      
        const contacts = await contactsQuery;
      
        response.status(200);
        return contacts;
    }
  

    public async store({ request, response }: HttpContextContract) {

        const contactData = await request.validate(ContactsValidator)
        const existingContact = await Database.query()
        .from('contatos')
        .where('ds_email', contactData.dsEmail)
        .first()

        if (existingContact) {
            response.status(400).send({ error: 'Este email já está cadastrado' })
            return
        }   

        const contact = await Contacts.create(contactData)
    
        response.status(201);
    
        return contact
    }

    public async update({ params, request, response }: HttpContextContract) {

        const contactData = await request.validate(ContactsValidator)
    
        const contact = await Contacts.findOrFail(params.id)
    
        contact.dsContato = contactData.dsContato

        contact.nrCelular = contactData.nrCelular

        contact.dsEmail = contactData.dsEmail
    
        contact.stAtivo = contactData.stAtivo
    
        await contact.save()
    
        response.status(201);
    
        return contact
    }

    public async show({ params }: HttpContextContract) {

        const contacts = await Contacts.findOrFail(params.id)
    
        return contacts
    
    }

    public async destroy({ params, response }: HttpContextContract) {

        const contacts = await Contacts.findOrFail(params.id)
    
        await contacts.delete()
    
        return response.status(204)
    }
}