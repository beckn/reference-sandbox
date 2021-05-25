import { Table, Column, Model, PrimaryKey, IsIn, IsUrl, Default } from 'sequelize-typescript';

@Table
export class Platform extends Model {
  @PrimaryKey
  @Column
  id: string

  @Column
  platform_name: string

  @Column
  platform_endpoint: string

  @Column
  public_key: string

  @Column
  domain: string

  @Column
  country: string 

  @Column
  city: string

  @IsIn([['BAP', 'BPP']])
  @Column
  platform_type: string

  @Column
  is_mock: boolean

  @Default(true)
  @Column
  active: boolean
}