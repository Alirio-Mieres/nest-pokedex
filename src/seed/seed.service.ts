import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interface/poke-response.interface';

import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
@Injectable()
export class SeedService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}

  async executeSeed(){

    await this.pokemonModel.deleteMany({}); //delete * from

    // const insertPromiseArray = [];
    const pokemonToInsert: {name: string, no:number}[] = []

    const data = await this.http.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=650")    
    
    data.results.forEach( ({name, url}) => {
      const segments = url.split('/');
      const no = +segments[ segments.length - 2];

      // const pokemon = await this.pokemonModel.create({name, no});

      // insertPromiseArray.push(
      //   this.pokemonModel.create({name, no})
      // );

      pokemonToInsert.push({name, no}) //[{name: bulbasaur, no: 1}]

    })
    
    // await Promise.all( insertPromiseArray );
    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed Executed';
  }


}

//nvm investigar
//git add .
//git commit -m "Antes de insertar por lote"

//revertir los cambios
//git checkout -- .