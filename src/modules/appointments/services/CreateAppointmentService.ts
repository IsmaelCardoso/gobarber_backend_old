import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from "@shared/errors/AppError";

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment.model';
import AppointmentsRepository from '@modules/appointments/repositories/appointemntsRepository';

interface RequestDTO {
  date: Date;
  provider_id: string;
}

class CreateAppointmentService {
  public async execute({
    provider_id,
    date,
  }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointementDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointementDate,
    );

    if (findAppointmentInSameDate) {
      new AppError('This appointemente is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointementDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
