// Import various libraries (boilerplate)
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// Import Unity's AI library
using UnityEngine.AI;

// This script tells moving obstacles where to go.
public class MovingObstacles : MonoBehaviour {
    // The start position of the obstacle.
    Vector3 start;
    // The end position of the obstacle (set via the Unity editor)
    public Vector3 end;
    // Whether the obstacle is on its return trip.
    bool onReturn = false;

    // This is the moving obstacle's navigation AI/controller
    NavMeshAgent nvm;

    // Awake is called before the first frame update. Unlike "Start", it is called regardless of whether the script is disabled.
    void Awake() {
        // Get the "NavMeshAgent" component the we gave the Litterbot during its development in Unity, and assign it to "nvm" so we
        // can use it.
        nvm = GetComponent<NavMeshAgent>();
        // Set the obstacle's destination to the end point.
        nvm.destination = end;
        // Set the obstacle's start at its current position.
        start = transform.position;
    }

    // Update is called once per frame, and tells the obstacle to go back when it reaches the end.
    void Update() {
        // If the obstacle is close to its destination...
        if (Vector3.Distance(nvm.destination, transform.position) <= 0.36) {
            // ...and if the object reached the end, set its new destination to the start.
            if (!onReturn) {
                nvm.destination = start;
                onReturn = true;
            // ...otherwise if the object reached the start, set its new destination to the end.
            } else {
                nvm.destination = end;
                onReturn = false;
            }
        }
    }
}
