import { expect, test, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'

import request from 'supertest'
import { app } from '../app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  
  afterAll(async () => {
    await app.close()
  })
  
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')

    execSync('npm run knex migrate:latest')
  })

  test('POST - User can create a new transaction', async () => {
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

  test('GET - User can list all transactions', async () => {
    const createResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'Transação Teste',
      amount: 5000,
      type: 'credit'
    })
    
    const cookies  = createResponse.get('Set-Cookie') ?? []

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Transação Teste', 
        amount: 5000
      })
    ])
  })
})
