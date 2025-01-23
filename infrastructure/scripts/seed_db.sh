PGPASSWORD=$TF_VAR_DATABASE_PASSWORD pg_isready -h $1 -U postgres -t 300 && psql -U postgres -h $1 <<EOF
CREATE DATABASE clabbert;
CREATE DATABASE inferius;
CREATE DATABASE jobberknoll;
CREATE DATABASE leprechaun;
EOF