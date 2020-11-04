import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import Orphanage from '../models/Orphanage'
import orphanageView from '../views/orphanage_view'
import * as yup from 'yup'

interface OrphanageProps {
    name: string;
    latitude: number;
    longitude: number;
    about: string;
    instructions: string;
    opening_hours: string;
    open_on_weekends: boolean;
    images: { path: string }[]
}

export default {
    async show(request: Request, response: Response) {
        const orphanagesRepository = getRepository(Orphanage)

        const { id } = request.params

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        })

        return response.json(orphanageView.render(orphanage))
    },

    async index(request: Request, response: Response) {
        const orphanagesRepository = getRepository(Orphanage)

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        })

        return response.json(orphanageView.renderMany(orphanages))
    },

    async create(request: Request, response: Response) {

        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = request.body

        const orphanagesRepository = getRepository(Orphanage)

        const requestImages = request.files as Express.Multer.File[]
        const images = requestImages.map(image => {
            return { path: image.filename }
        })

        const orphanageData: OrphanageProps = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images
        }

        const schema = yup.object().shape({
            name: yup.string().required(),
            latitude: yup.number().required(),
            longitude: yup.number().required(),
            about: yup.string().required().max(300),
            instructions: yup.string().required(),
            opening_hours: yup.string().required(),
            open_on_weekends: yup.boolean().required(),
            images: yup.array(yup.object().shape({
                path: yup.string().required()
            }))
        })

        await schema.validate(orphanageData, {
            abortEarly: false
        })

        const orphanage = orphanagesRepository.create(orphanageData)

        await orphanagesRepository.save(orphanage)

        response.status(201).json(orphanage)
    }
}