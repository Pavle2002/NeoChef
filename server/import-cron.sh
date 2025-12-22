while :; do
  node server/dist/scripts/import-recipes.js
  sleep 43200  # Sleep for 12 hours
done