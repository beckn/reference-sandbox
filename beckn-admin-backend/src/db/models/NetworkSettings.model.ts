import { Table, Column, Model, PrimaryKey, Default, IsIn } from 'sequelize-typescript';
import { network_settings_list } from '../../config/config'

@Table
export class NetworkSettings extends Model {
  @PrimaryKey
  @IsIn([network_settings_list])
  @Column
  setting: string

  @Column
  value: string

  @Default(true)
  @Column
  active: boolean
}