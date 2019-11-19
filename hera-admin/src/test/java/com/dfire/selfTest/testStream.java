package com.dfire.selfTest;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;


/**
 * Created by E75 on 2019/6/11.
 */
public class testStream {

    public static void main(String[] args) {
     //   List<Integer> list= new ArrayList(1);
        List<Integer> list= new LinkedList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        list.add(1);
        list.add(2);
        list.add(3);

     //   List<Integer> collect = list.stream().filter(Predicate.isEqual(2)).collect(Collectors.toList());
     //   System.out.println(collect);
        Optional<Integer> any = list.stream().findAny();
        System.out.println(any.getClass());


    }
}
