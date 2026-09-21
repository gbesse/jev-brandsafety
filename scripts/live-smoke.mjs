// Purpose: Guard the unwired live provider adapter.
if(!process.env.TYPESAFE_API_KEY)throw Error('Set TYPESAFE_API_KEY');throw Error('Live adapter not wired; zero requests made');
