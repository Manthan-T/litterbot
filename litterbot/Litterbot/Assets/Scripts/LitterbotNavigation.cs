// Import the System library for string comparisons
using System;

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

    // This is the queue of all rubbish a Litterbot has detected
    List<GameObject> rubbishObjectQueue = new List<GameObject>();

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
        if (Vector3.Distance(nvm.destination, transform.position) <= 0.36) {
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
        
        // If there is rubbish to be collected...
        if (!(rubbishObjectQueue.Count == 0)) {
            // And if the object is still there (may have been picked up by another litterbot)...
            if (rubbishObjectQueue[0] != null) {
                // Set the new destination to the location of the rubbish.
                nvm.destination = rubbishObjectQueue[0].transform.position;

                // If the litterbot reaches the rubbish it is set on...
                if (Vector3.Distance(rubbishObjectQueue[0].transform.position, transform.position) <= 0.36) {
                    // Suck it up (remove it from the scene) and remove it from the list of rubbish to collect.
                    Destroy(rubbishObjectQueue[0]);
                    rubbishObjectQueue.RemoveAt(0);
                }
            
            // Otherwise remove the non-existent object from the list of objects to pick up.
            } else {
                rubbishObjectQueue.RemoveAt(0);
            }
        }

        // For every degree in a circle (in otherwords make a circle)...
        for (int degree = 0; degree < 360; degree++) {
            // Set the start of the ray and the direction it should go...
            Vector3 start = new Vector3(transform.position.x, transform.position.y, transform.position.z);
            var dir = Quaternion.Euler(0, degree, 0) * transform.right;

            // Prepare for a potential hit and cast out the ray. If a hit is detected...
            RaycastHit hit;
            if (Physics.Raycast(start, dir * 2, out hit, (dir * 2).magnitude)) {
                // Prepare for a second ray to be cast.
                Vector3 check = new Vector3(transform.position.x, transform.position.y + 0.2075f, transform.position.z);
                RaycastHit hit2;

                // Check if the ray hits the object too. This ray is cast at a higher height, and if there is a hit, it
                // means that the object is too tall to pass underneath the robot's vacuum, (eg, a car), and should be ignored.
                // If the object is not too tall...
                if (!Physics.Raycast(check, dir * 2, out hit2, (dir * 2).magnitude)) {
                    // And the object is not a part of the town (ie, a sidewalk or something)
                    if (!ObjectPartOfTown(hit.colliderInstanceID)) {
                            // Draw a blue ray for debugging purposes.
                            Debug.DrawRay(start, dir * hit.distance, Color.blue);

                            // Add the ray to the queue or rubbish to pick up if it isn't already there.
                            if (!rubbishObjectQueue.Contains(hit.collider.gameObject)) {
                                rubbishObjectQueue.Add(hit.collider.gameObject);
                            }
                    // If the object is a part of the town, draw a red ray for debugging purposes.
                    } else {
                        Debug.DrawRay(start, dir * 2, Color.red);
                    }
                // If the object cannot be picked up, draw a yellow ray for debugging purposes.
                } else {
                    Debug.DrawRay(start, dir * hit.distance, Color.yellow);
                }
            // If no object is detected, draw a red ray for debugging purposes.
            } else {
                Debug.DrawRay(start, dir * 2, Color.red);
            }
        }
    }
    
    // Finds out whether an object is a part of the town (and should be ignored) or not, given its ID.
    public static bool ObjectPartOfTown(int id) {
        // Make a Unity object with the flags below. We need to cast from a modified object to just an object.
        UnityEngine.Object obj = (UnityEngine.Object) typeof (UnityEngine.Object)
                    .GetMethod("FindObjectFromInstanceID", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static)
                    .Invoke(null, new object[] { id });

        // Get the parent of the object.
        Transform parent = GameObject.Find(obj.name).transform.parent;

        // If the object has a parent (otherwise parent is null).
        if (parent != null)
            // Return whether or not the parent is called town.
            return String.Equals(parent.ToString(), "town (UnityEngine.Transform)");
        // Otherwise return false.
        else
            return false;
    }
}
