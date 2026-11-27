import {
  Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne,
  PrimaryGeneratedColumn, Relation, Unique,
} from 'typeorm';

// Los enums limitan los roles, modalidades y estados del dominio.
export enum Role { Admin = 'admin', Student = 'estudiante' }
export enum TournamentState { Open = 'abierto', Closed = 'cerrado', Finished = 'finalizado' }
export enum Mode { League = 'liga', Elimination = 'eliminacion' }
export enum EntryState { Pending = 'pendiente', Accepted = 'aceptada', Rejected = 'rechazada' }
export enum MatchState { Scheduled = 'programado', Finished = 'finalizado' }

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 100 }) nombre!: string;
  @Column({ length: 40 }) alias!: string;
  @Column({ length: 180, unique: true }) correo!: string;
  // El hash se omite en las consultas normales.
  @Column({ select: false, length: 200 }) password!: string;
  @Column({ type: 'enum', enum: Role, default: Role.Student }) rol!: Role;
  @Column({ default: true }) activo!: boolean;
}

@Entity('equipos')
export class Team {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 100, unique: true }) nombre!: string;
  @Column() capitanId!: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'capitanId' }) capitan!: Relation<User>;
  @ManyToMany(() => User)
  // Tabla intermedia de la relación muchos a muchos.
  @JoinTable({ name: 'equipo_integrantes' }) integrantes!: Relation<User[]>;
  @Column({ length: 80 }) juegoPreferido!: string;
  @Column({ length: 20, default: 'activo' }) estado!: string;
}

@Entity('torneos')
export class Tournament {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 100 }) nombre!: string;
  @Column({ length: 80 }) videojuego!: string;
  @Column({ type: 'enum', enum: Mode }) modalidad!: Mode;
  @Column({ type: 'datetime' }) fechaInicio!: Date;
  @Column({ type: 'datetime' }) cierreInscripcion!: Date;
  @Column() cupoMaximo!: number;
  @Column({ type: 'enum', enum: TournamentState }) estado!: TournamentState;
}

@Entity('inscripciones')
// Cada equipo tiene una sola inscripción por torneo.
@Unique(['torneoId', 'equipoId'])
export class Entry {
  @PrimaryGeneratedColumn() id!: number;
  @Column() torneoId!: number;
  // Al borrar un torneo, MySQL borra sus inscripciones.
  @ManyToOne(() => Tournament, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'torneoId' }) torneo!: Relation<Tournament>;
  @Column() equipoId!: number;
  @ManyToOne(() => Team)
  @JoinColumn({ name: 'equipoId' }) equipo!: Relation<Team>;
  @Column({ type: 'datetime' }) fecha!: Date;
  @Column({ type: 'enum', enum: EntryState }) estado!: EntryState;
}

@Entity('partidos')
export class Match {
  @PrimaryGeneratedColumn() id!: number;
  @Column() torneoId!: number;
  @ManyToOne(() => Tournament)
  @JoinColumn({ name: 'torneoId' }) torneo!: Relation<Tournament>;
  @Column() equipoLocalId!: number;
  @ManyToOne(() => Team)
  @JoinColumn({ name: 'equipoLocalId' }) local!: Relation<Team>;
  @Column() equipoVisitanteId!: number;
  @ManyToOne(() => Team)
  @JoinColumn({ name: 'equipoVisitanteId' }) visitante!: Relation<Team>;
  @Column({ type: 'datetime' }) fechaHora!: Date;
  @Column({ length: 60 }) ronda!: string;
  @Column({ type: 'enum', enum: MatchState, default: MatchState.Scheduled }) estado!: MatchState;
}

@Entity('resultados')
export class Result {
  @PrimaryGeneratedColumn() id!: number;
  // Solo un resultado oficial por partido.
  @Column({ unique: true }) partidoId!: number;
  @OneToOne(() => Match)
  @JoinColumn({ name: 'partidoId' }) partido!: Relation<Match>;
  @Column() puntajeLocal!: number;
  @Column() puntajeVisitante!: number;
  // Un ganador nulo representa un empate.
  @Column({ type: 'int', nullable: true }) ganadorId!: number | null;
  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn({ name: 'ganadorId' }) ganador!: Relation<Team> | null;
  @Column() registradoPor!: number;
  @ManyToOne(() => User)
  // Identifica al administrador que registró el resultado.
  @JoinColumn({ name: 'registradoPor' }) administrador!: Relation<User>;
}

export const entities = [User, Team, Tournament, Entry, Match, Result];
