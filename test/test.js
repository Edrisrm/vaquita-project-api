var app = require('../express_server'),
  chai = require('chai'),
  request = require('supertest');
let token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI1ZmI5MjI0ZGVkZGJmMzM1ZTRiY2U4OGQiLCJlbWFpbCI6ImVkcmlzcmlvc21vcmFsZXNAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IkVkcmlzIiwiZmFtaWx5X25hbWUiOiJSaW9zIE1vcmFsZXMiLCJyb2xlIjoiUk9MRV9BRE1JTklTVFJBVE9SIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdnUVNJRmJhdFR5UzN1UHFEVG1tLTZSWUdaMEZtRGwtcHFjTkFRd29RPXM5Ni1jIiwidHdvX2ZhY3RvcnNfYWN0aXZhdGVkIjp0cnVlLCJpYXQiOjE2MDU5NjkxMDJ9.zVuSeHDftFC3V22qF9YsQACGBqLWtrM7MtBiheL5fdA`
describe('POST/Inventory', () => {

  it('responds with json',(done) =>{
    request(app)
        .post(`/api/agregar-inventario`)
        .send({breed: "miura", age_in_months: "1 año", status: "en_finca", weight: "200", apartValue: "1"})
        .expect(403)
        .end(function(err, res){
            if(err){
                console.log(err);
                done(err);
            }
            else {
                done();
            }
        });
  })
})
describe('POST/Apart', () => {
    it('responds with json',(done) =>{
      request(app)
          .post(`/api/agregar-apartado`)
          .send({square_meter: 120, apart_number: 12})
          .set({ "Authorization": token })
          .expect(200)
          .end(function(err, res){
              if(err){
                  console.log(err);
                  done(err);
              }
              else {
                  done();
              }
          });
    })
  })
let num = 1;
describe('GET/Inventory', () => {
    it('responds with json',(done) =>{
      request(app)
          .get(`/api/inventario-en-finca/${num}`)
          .set('Accept', 'application/json')
          .set({ "Authorization": token })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res){
              if(err){
                  console.log(err);
                  done(err);
              }
              else {
                  done();
                  return;
              }
          });
    })
  })
  describe('GET/historicos', () => {
    it('responds with json',(done) =>{
      request(app)
          .get(`/api/historicos/${num}`)
          .set('Accept', 'application/json')
          .set({ "Authorization": token })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res){
              if(err){
                  console.log(err);
                  done(err);
              }
              else {
                  done();
                  return;
              }
          });
    })
  })

  describe('GET/aparts', () => {
    it('responds with json',(done) =>{
      request(app)
          .get(`/api/apartos`)
          .set('Accept', 'application/json')
          .set({ "Authorization": token })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res){
              if(err){
                  console.log(err);
                  done(err);
              }
              else {
                  done();
                  return;
              }
          });
    })
  })