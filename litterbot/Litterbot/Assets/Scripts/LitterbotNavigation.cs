// Import various libraries (boilerplate)
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// Import Unity's AI library
using UnityEngine.AI;

// This script lays out how a Litterbot should navigate, and inherits from the boilerplate "MonoBehaviour" class (must be used for any
// Unity script).
public class LitterbotNavigation : MonoBehaviour {
    // This is an array of all the places that a Litterbot needs to reach (junctions, the final destination, and the start).
    // "SerializeField" allows us to input the points to be reached along the path from Unity.
    [SerializeField] Transform[] destinations;

    // The index of the point that a Litterbot currently needs to reach. This changes each time the robot reaches a destination.
    int currentDestination = 0;

    // A flag that decides whether a Litterbot needs to make the return journey. Using this allows it to go through the destinations
    // (or junctions or checkpoints) in reverse to work its way back to the start.
    bool backwards = false;

    // This is a Litterbot's navigation AI/controller
    NavMeshAgent nvm;

    // Awake is called before the first frame update. Unlike "Start", it is called regardless of whether the script is disabled.
    void Awake() {
        // Get the "NavMeshAgent" component the we gave the Litterbot during its development in Unity, and assign it to "nvm" so we
        // can use it.
        nvm = GetComponent<NavMeshAgent>();
    }

    // Update is called once per frame, and updates the destination of a Litterbot.
    void Update() {
        // Set the destination for a Litterbot using the position of the point indicated by the "currentDestination" flag
        nvm.destination = destinations[currentDestination].position;
        
        // If the Litterbot reaches its destination...
        if (Vector3.Distance(nvm.destination, transform.position) <= 0.35) {
            // ...check if either:
            // a) the Litterbot is going forwards (not backwards in the code) and the final destination has been reached
            if (!backwards && currentDestination == destinations.Length - 1)
                // If so, change the flag to make the Litterbot go back along its route
                backwards = true;
            // b) the Litterbot is going backwards and the start has been reached
            else if (backwards && currentDestination == 0)
                // If so, change the flag to make the Litterbot go forwards along its route
                backwards = false;

            // As the destination has been reached, the Litterbot needs a new one to go to
            // If the Litterbot is going forwards,
            if (!backwards)
                // Set the destination to the next one in the array
                currentDestination++;
            // If it is going backwards, since the next destination is the one before on the array,
            else
                // Set the destination to the "previous" one in the array (although it is backwards)
                currentDestination--;
        
            /*
             *
             * Another way to understand this if-else statement is that if the Litterbot is going forwards, then the array is
             * in the correct, forwards order. If it is going backwards, then the destinations in the array are in reverse order,
             * And the else part therefore works backwards.
             *
             */
        }
    }
}
