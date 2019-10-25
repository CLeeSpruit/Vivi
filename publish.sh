#!/usr/bin/env bash
stage="./dist"

echo "Switching to master branch and grabbing latest..."
git checkout master
git pull

echo "Is this a major, minor, or patch update?"
select update in "major" "minor" "patch";
do
    npm version $update
    break
done

echo "Building and staging files..."
npm run dist

# Copy over newly edited package.json
cp package.json $stage

cd $stage
npm publish --scope=public
cd ../

echo "Publish complete!"
echo "Push changes to github?"
select push in "Yes" "No"; 
do
    case $push in
        Yes) git push --tags
        break
        ;;
        No) echo "Skipping push. Don't forget to do it yourself!"
        break
        ;;
    esac
done
