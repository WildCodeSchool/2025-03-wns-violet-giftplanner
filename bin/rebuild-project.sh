#!/bin/bash
echo "🚀 Reconstruction complète du projet..."

echo ""

./bin/clean-node-modules.sh no-finish

echo ""

./bin/install-node-modules.sh no-finish

echo ""

echo "🎉 Projet reconstruit avec succès."