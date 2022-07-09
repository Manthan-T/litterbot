using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WheelRoll : MonoBehaviour {
    public Rigidbody wheelSet;

    // Start is called before the first frame update
    void Start() {
        wheelSet = GetComponent<Rigidbody>();
    }

    // Update is called once per frame
    void Update() {
        if (Input.GetKey("w")) {
            wheelSet.velocity = new Vector3(0, 0, 5);
        }
    }
}
