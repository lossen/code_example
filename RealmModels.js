import Realm from 'realm';

class User {}
User.schema = {
  name: 'User',
  primaryKey: 'email',
  properties: {
    email: {type:'string',optional:true},
    first_name: {type:'string',optional:true},
    last_name: {type:'string',optional:true},
    corporate_code: {type:'string',optional:true},
    user_token: {type:'string',optional:true},
  },
};

class ValueRefocus {}
ValueRefocus.schema = {
    name: 'ValueRefocus',
    primaryKey: 'order',
    properties: {
        id: {type:'int'},
        order: {type:'int'},
        title: {type:'string',optional:true},
        name: {type:'string',optional:true},
        uri: {type:'string'},
        uri_s3: {type:'string'},
        type: {type:'string'},
    },
};

class SubscriptionPlan {}
SubscriptionPlan.schema = {
    name: 'SubscriptionPlan',
    primaryKey: 'plan_id',
    properties: {
        plan_id: {type:'string',optional:true},
        subscribed_before: {type:'string',optional:true},
        subscription_id: {type:'string',optional:true},
    },
};


export default new Realm(
    {
        schema: [User,SubscriptionPlan,ValueRefocus],schemaVersion:15
    }
);

