using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class LitterbotMovement : MonoBehaviour {
    //bool onReturn = false;
    //bool[] transformSet = {false, false}
    //bool rotComplete = true;

    Vector3 start;
    Vector3 destination;
    bool endReached = false;

    [SerializeField] Transform destinationObject;
    [SerializeField] Transform[] junctionLocations;
    [SerializeField] float[] junctionTurnAngles;
    bool[] junctionsPassed;

    void Awake() {
        start = transform.position;
        destination = destinationObject.position;
        if (junctionLocations.Length != 0) {
            junctionsPassed = new bool[junctionLocations.Length];
            foreach (bool passed in junctionsPassed) {
                passed = false;
            }
        }
    }

    // Update is called once per frame
    void Update() {
        transform.position += Vector3.forward/4 * Time.deltaTime;

        if (junctionLocations.Length != 0) {
            foreach (Transform junctionLocation in junctionLocations) {
                if (Vector3.Distance <= ) {

                }                
            }
        }
    }

    void Turn(float ang) {
        transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.Euler(0, ang, 0),  0);
    }
}