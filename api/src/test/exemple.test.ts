import { expect, test, beforeAll, afterAll } from 'vitest'
// import { createServer } from 'node:http'
import request from 'supertest'
import { app } from '../app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

test('O usuário consegue criar uma nova transação POST', async () => {
  await request(app.server)
    .post('/transactions')
    .send({
      title: 'Transação Teste',
      amount: 5000,
      type: 'credit'
    })
    .expect(201)
  // Retorno da resposta espera-se que seja concluído 
})