// Import various libraries (boilerplate)
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// Import Unity's AI library
using UnityEngine.AI;

// This script causes rubbish to be spawned somewhere.
public class SpawnRubbish : MonoBehaviour {
    // An array of the different types of rubbish provided from the Unity editor (ie, a water bottle and a crisp packet)
    public GameObject[] rubbishTypes;

    // The method to spawn rubbish.
    public void SpawnRandomRubbish() {
        // A flag to check whether a valid point has been found.
        bool gotPoint = false;

        // While a valid point has not been found...
        while (!gotPoint) {
            // Choose a random point to spawn the rubbish on the map at road level. 
            Vector3 position = new Vector3(Random.Range(10.95f, -8.74f), 0.6f, Random.Range(5.35f, -14.45f));
            
            // Prepare for the point being present on the NavMesh (with a 0.05 tolerence for being off the NavMesh).
            NavMeshHit hit;
            // If the point is on the roads and also the NavMesh (ie, on the road but not under a car (because how can someone drop
            // rubbish there))
            if (NavMesh.SamplePosition(position, out hit, 0.05f, NavMesh.AllAreas) && OnRoad(position)) {
                // Prepare a rubbish GameObject.
                GameObject rubbishObject;

                // Create a new rubbish GameObject as either a water bottle or a crisp packet (models provided by the "rubbishTypes"
                // array filled in the Unity editor).
                if (Random.Range(0f, 1f) > 0.5f)
                    rubbishObject = Instantiate(rubbishTypes[0]);
                else
                    rubbishObject = Instantiate(rubbishTypes[1]);
                
                // Set the rubbish object's to the generated location.
                rubbishObject.transform.position = position;
            }
            // Break out of the loop.
            gotPoint = true;
        }
    }

    // This method checks to see whether or not the point is on a road.
    bool OnRoad(Vector3 position) {
        if ((position.x >= 8.07f && position.x <= 10 && position.y >= -13.16f && position.y <= 5.3f) ||
            (position.x >= -4.92f && position.x <= 8.07f && position.y >= -11.13f && position.y <= -9.35f) ||
            (position.x >= -4.92f && position.x <= -3.01 && position.y >= -9.35f && position.y <= 5.3f) ||
            (position.x >= 4.07f && position.x <= 6 && position.y >= -5.26f && position.y <= 5.3f) ||
            (position.x >= -8.2f && position.x <= 6 && position.y >= -5.26f && position.y <= -3.37f))
            return true;
        else
            return false;
    }
}
