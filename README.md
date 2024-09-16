# Tenuto

## Introduction
Imagine being able to instantly find the perfect song to match any given moment… With Tenuto, this becomes reality, while also providing users with accessible mental health support in a new way. Tenuto utilizes music as a way to regulate mood in a way that is customized to the user’s specific emotional needs in real time. 

## How it works
Simply connect your Spotify and Fitbit accounts, then input your mood and situation into the app. Tenuto uses your emotional state, heart rate, and music preferences to provide the perfect song recommendation for any given moment. Tenuto is a musical therapy app designed to help users relax and improve their mood through personalized music suggestions. These recommendations are based on the user’s saved music from Spotify, combined with their heart rate variability, which provides a more accurate picture of stress levels than heart rate alone. Heart rate variability reflects the balance between your sympathetic and parasympathetic nervous systems, offering insights into your overall well-being. While a high heart rate could indicate stress, it could also result from excitement or physical activity, making heart rate variability a more reliable measure of your emotional and physical state.

## How we built it?
We used React Native for the front-end development, enabling cross-platform compatibility for both iOS and Android. On the backend, we integrated the Fitbit API to gather real-time heart rate data, which was processed using Convex for fast data management. We also leveraged the Spotify API to access the user’s playlists and music preferences. Our algorithm encompasses a wide array of nuanced human emotion, we used Cohere’s large language models to process the user’s inputted mood and emotional state, using Pinecone as a vector database. This enabled us to produce accurate personalized recommendations based on contextual inputs. 

## Limitations
The original plan was to integrate Apple Watch to analyze the user’s heart rate, but we ran into issues with accessing the information from Apple. It required using XCode while we had already built the remainder of our project in VSCode with React Native. Although integrating this data would be possible, we opted for using Fitbit instead, as their data is more easily accessible and updates faster. Additionally, fine-tuning our recommendation algorithm to effectively combine heart rate data, emotional input, and music preferences was complex, but Cohere’s API helped smooth out the process.

## What's next for Tenuto
Our next steps for Tenuto include adding support for more wearable devices, such as Apple Watch, to expand the app's compatibility and reach a broader user base. We also plan to further refine our algorithm by incorporating machine learning to provide even more accurate and adaptive recommendations based on a user's evolving emotional and physiological states, as well as their music taste. Additionally, we aim to integrate a journaling feature, where users can track their mood over time and see how different music selections have affected their well-being. Finally, we hope to implement voice input features and implement sleep and study music features by incorporating customized binaural beats and other soothing soundscapes.

## Demo
The following video explains how we used Convex and demos the app: https://www.youtube.com/watch?v=1MDw7v7yOvc

## Credits
This repository was created by Alexandra MacLeod (@amacleod1417), with help from Allison Cretel (@allcre), Ashley Christendat (@ashleychristen), and Abhinav Jha (@abhinav24jha). 
