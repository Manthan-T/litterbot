// Import various libraries (boilerplate)
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// This script causes a Litterbot to spawn or be removed.
public class AddOrRemoveLitterbot : MonoBehaviour {
    // This is the Litterbot which will be used to copy from and make more.
    // "SerializeField" allows us to input the Litterbot object from Unity.
    [SerializeField] GameObject litterbot;
    // Counts the number of Litterbots present.
    int litterbotCount = 1;

    // The method to spawn more clones. "public" is used the same way as "[SerializeField]".
    public void SpawnLitterbotClone() {
        // Caps the number of Litterbots at 5 (primarily because on the provided map there are only 5 real paths to take (that
        // are long enough)).
        if (litterbotCount != 5) {
            // Create a new Litterbot GameObject.
            GameObject newLitterbot = Instantiate(litterbot);
            // Set its location to a predetermined start point.
            newLitterbot.transform.position = new Vector3(-3.86f, 0.5915f, -10.87f);
            // Update the number of Litterbots present.
            litterbotCount++;
            // Update the Litterbot's name to match the count.
            newLitterbot.name = "Litterbot " + litterbotCount;
        }
    }

    // The method to delete clones. "public" is used the same way as "[SerializeField]".
    public void DeleteLitterbotClone() {
        // Makes sure that there is always at least one Litterbot at any given time.
        if (litterbotCount != 1) {
            // Remove the last spawned Litterbot.
            Destroy(GameObject.Find("Litterbot " + litterbotCount));
            // Update the number of Litterbots present.
            litterbotCount--;
        }
    }
}
